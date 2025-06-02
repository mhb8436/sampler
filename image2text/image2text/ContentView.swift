import SwiftUI
import Vision
import PhotosUI
import Translation

struct RecognizedText: Identifiable {
    let id = UUID()
    let string: String
    let boundingBox: CGRect
}

struct TranslatedText: Identifiable {
    let id = UUID()
    let originalText: String
    let translatedText: String
    let boundingBox: CGRect
}

struct ContentView: View {
    @StateObject private var cameraViewModel = CameraViewModel()
    @State private var recognizedTexts: [RecognizedText] = []
    @State private var translatedTexts: [TranslatedText] = []
    @State private var showOverlay: Bool = false
    @State private var showImagePicker: Bool = false
    @State private var processedImage: UIImage? // OCR 처리된 이미지를 저장
    @State private var showTranslation: Bool = false
    @State private var sourceLanguage: Locale.Language = Locale.Language(identifier: "ko")
    @State private var targetLanguage: Locale.Language = Locale.Language(identifier: "en")
    @State private var isTranslating: Bool = false
    @State private var translationConfiguration: TranslationSession.Configuration?
    
    var body: some View {
        VStack {
            ZStack {
                if let image = processedImage ?? cameraViewModel.capturedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 300)
                        .cornerRadius(12)
                        .padding()
                } else {
                    CameraView(viewModel: cameraViewModel)
                        .frame(height: 300)
                        .cornerRadius(12)
                        .padding()
                }
                
                if showOverlay, let image = processedImage ?? cameraViewModel.capturedImage {
                    GeometryReader { geometry in
                        ZStack {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFit()
                                .frame(width: geometry.size.width)
                            
                            if showTranslation {
                                ForEach(translatedTexts, id: \.id) { text in
                                    Text(text.translatedText)
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(.blue)
                                        .background(Color.white.opacity(0.8))
                                        .position(
                                            x: text.boundingBox.midX * geometry.size.width,
                                            y: text.boundingBox.midY * geometry.size.height
                                        )
                                }
                            } else {
                                ForEach(recognizedTexts, id: \.id) { text in
                                    Text(text.string)
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundColor(.red)
                                        .background(Color.white.opacity(0.7))
                                        .position(
                                            x: text.boundingBox.midX * geometry.size.width,
                                            y: text.boundingBox.midY * geometry.size.height
                                        )
                                }
                            }
                        }
                    }
                }
            }
            
            // 언어 선택 UI
            if !recognizedTexts.isEmpty {
                VStack {
                    Text("번역 언어 설정")
                        .font(.headline)
                        .padding(.top)
                    
                    HStack {
                        VStack {
                            Text("원본 언어")
                                .font(.caption)
                            Picker("Source", selection: $sourceLanguage) {
                                Text("한국어").tag(Locale.Language(identifier: "ko"))
                                Text("영어").tag(Locale.Language(identifier: "en"))
                            }
                            .pickerStyle(MenuPickerStyle())
                        }
                        
                        Image(systemName: "arrow.right")
                            .padding(.horizontal)
                        
                        VStack {
                            Text("번역 언어")
                                .font(.caption)
                            Picker("Target", selection: $targetLanguage) {
                                Text("한국어").tag(Locale.Language(identifier: "ko"))
                                Text("영어").tag(Locale.Language(identifier: "en"))
                            }
                            .pickerStyle(MenuPickerStyle())
                        }
                    }
                    .padding(.horizontal)
                }
            }

            HStack {
                
                Button(action: {
                    
                    if let image = cameraViewModel.capturedImage {
                        autoreleasepool {
                            if let resizedImage = resizeImage(image, targetSize: CGSize(width: 1024, height: 1024)),
                               let processedImage = preprocessImage(resizedImage) {
                                recognizeText(from: processedImage)
                            } else {
                                if let resizedOriginal = resizeImage(image, targetSize: CGSize(width: 1024, height: 1024)) {
                                    recognizeText(from: resizedOriginal)
                                } else {
                                    recognizeText(from: image)
                                }
                            }
                        }
                    }
                }) {
                    Text("텍스트 인식하기")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
                .disabled(cameraViewModel.capturedImage == nil)
                
                if !recognizedTexts.isEmpty {
                    Button(action: {
                        translateTexts()
                    }) {
                        HStack {
                            if isTranslating {
                                ProgressView()
                                    .scaleEffect(0.8)
                            }
                            Text(isTranslating ? "번역 중..." : "번역하기")
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.purple)
                        .cornerRadius(10)
                    }
                    .disabled(isTranslating)
                }
                
                if cameraViewModel.capturedImage != nil {
                    Button(action: {
                        if !translatedTexts.isEmpty && showOverlay {
                            showTranslation.toggle()
                        } else {
                            showOverlay.toggle()
                        }
                    }) {
                        Text(showOverlay ? (showTranslation ? "원문 보기" : "오버레이 숨기기") : "오버레이 보기")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.green)
                            .cornerRadius(10)
                    }
                }
                
                if processedImage != nil {
                    Button(action: {
                        cleanupMemory()
                    }) {
                        Text("원본으로")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.orange)
                            .cornerRadius(10)
                    }
                }
            }
            .padding()
            
            ScrollView {
                VStack(alignment: .leading, spacing: 8) {
                    if showTranslation && !translatedTexts.isEmpty {
                        ForEach(translatedTexts, id: \.id) { text in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text("원문:")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    Text(text.originalText)
                                        .font(.body)
                                }
                                HStack {
                                    Text("번역:")
                                        .font(.caption)
                                        .foregroundColor(.blue)
                                    Text(text.translatedText)
                                        .font(.body)
                                        .foregroundColor(.blue)
                                }
                                Divider()
                            }
                            .padding(.horizontal)
                        }
                    } else {
                        ForEach(recognizedTexts, id: \.id) { text in
                            Text(text.string)
                                .padding(.horizontal)
                        }
                    }
                }
            }
            .frame(height: 200)
            .background(Color(.systemGray6))
            .cornerRadius(12)
            .padding()
        }
        .sheet(isPresented: $showImagePicker) {
            ImagePicker(image: Binding(
                get: { cameraViewModel.capturedImage ?? UIImage() },
                set: {
                    cameraViewModel.capturedImage = $0
                    processedImage = nil // 새 이미지 선택 시 처리된 이미지 초기화
                    recognizedTexts = []
                    translatedTexts = []
                    showOverlay = false
                    showTranslation = false
                }
            ))
        }
        // TranslationSession을 위한 translationTask modifier 추가
        .translationTask(translationConfiguration) { session in
            await performTranslations(using: session)
        }
    }
    
    // 번역 함수 수정
    private func translateTexts() {
        guard !recognizedTexts.isEmpty else { return }
        
        isTranslating = true
        translatedTexts = []
        
        // TranslationSession.Configuration 설정
        if translationConfiguration == nil {
            translationConfiguration = TranslationSession.Configuration(
                source: sourceLanguage,
                target: targetLanguage
            )
        } else {
            // 기존 구성이 있으면 무효화하여 새로운 번역 트리거
            translationConfiguration?.invalidate()
        }
    }
    
    // 실제 번역 수행 함수
    private func performTranslations(using session: TranslationSession) async {
        do {
            // 번역 요청 생성
            let requests = recognizedTexts.enumerated().map { index, text in
                TranslationSession.Request(
                    sourceText: text.string,
                    clientIdentifier: "\(index)"
                )
            }
            
            var tempTranslatedTexts: [TranslatedText] = []
            
            // 배치 번역 수행
            for try await response in session.translate(batch: requests) {
                if let clientId = response.clientIdentifier,
                   let index = Int(clientId),
                   index < recognizedTexts.count {
                    
                    let translatedText = TranslatedText(
                        originalText: recognizedTexts[index].string,
                        translatedText: response.targetText,
                        boundingBox: recognizedTexts[index].boundingBox
                    )
                    
                    tempTranslatedTexts.append(translatedText)
                }
            }
            
            // UI 업데이트
            await MainActor.run {
                self.translatedTexts = tempTranslatedTexts.sorted { $0.boundingBox.minY < $1.boundingBox.minY }
                self.isTranslating = false
                self.showTranslation = true
                self.showOverlay = true
            }
            
        } catch {
            print("번역 오류: \(error)")
            await MainActor.run {
                self.isTranslating = false
                // 번역 실패 시 원본 텍스트를 표시
                let failedTranslations = recognizedTexts.map { text in
                    TranslatedText(
                        originalText: text.string,
                        translatedText: "[번역 실패: \(text.string)]",
                        boundingBox: text.boundingBox
                    )
                }
                self.translatedTexts = failedTranslations
                self.showTranslation = true
                self.showOverlay = true
            }
        }
    }
    
    private func recognizeText(from image: UIImage) {
        guard let cgImage = image.cgImage else { return }
        
        // 메모리 최적화: autoreleasepool 사용
        autoreleasepool {
            let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
            let request = VNRecognizeTextRequest { request, error in
                guard let observations = request.results as? [VNRecognizedTextObservation],
                      error == nil else {
                    return
                }
                
                let recognizedTexts = observations.compactMap { observation -> RecognizedText? in
                    // 상위 3개의 인식 결과를 확인하고 신뢰도가 높은 결과 선택
                    let candidates = observation.topCandidates(3)
                    guard let topCandidate = candidates.first,
                          topCandidate.confidence > 0.5 else { return nil } // 신뢰도가 50% 이상인 결과만 사용
                    
                    let boundingBox = observation.boundingBox
                    let transformedBox = CGRect(
                        x: boundingBox.minX,
                        y: 1 - boundingBox.maxY,
                        width: boundingBox.width,
                        height: boundingBox.height
                    )
                    
                    return RecognizedText(
                        string: topCandidate.string,
                        boundingBox: transformedBox
                    )
                }
                
                DispatchQueue.main.async {
                    self.recognizedTexts = recognizedTexts
                    self.translatedTexts = []
                    self.showOverlay = true
                    self.showTranslation = false
                    
                    // 메모리 최적화: autoreleasepool로 이미지 처리 감싸기
                    autoreleasepool {
                        // 더 작은 크기로 OCR 처리된 이미지 생성 (메모리 절약)
                        let maxSize: CGFloat = 1024
                        let scaleFactor = min(maxSize / image.size.width, maxSize / image.size.height, 1.0)
                        let scaledSize = CGSize(
                            width: image.size.width * scaleFactor,
                            height: image.size.height * scaleFactor
                        )
                        
                        UIGraphicsBeginImageContextWithOptions(scaledSize, false, 0.0)
                        image.draw(in: CGRect(origin: .zero, size: scaledSize))
                        
                        let context = UIGraphicsGetCurrentContext()
                        context?.setStrokeColor(UIColor.red.cgColor)
                        context?.setLineWidth(2.0)
                        
                        // 인식된 텍스트 영역에 박스 그리기 (스케일된 크기에 맞춤)
                        for text in recognizedTexts {
                            let rect = CGRect(
                                x: text.boundingBox.minX * scaledSize.width,
                                y: text.boundingBox.minY * scaledSize.height,
                                width: text.boundingBox.width * scaledSize.width,
                                height: text.boundingBox.height * scaledSize.height
                            )
                            context?.stroke(rect)
                        }
                        
                        if let processedImage = UIGraphicsGetImageFromCurrentImageContext() {
                            self.processedImage = processedImage
                        }
                        
                        UIGraphicsEndImageContext()
                    }
                }
            }
            
            // 한글 인식을 위한 설정
            request.recognitionLevel = .accurate
            request.recognitionLanguages = ["ko-KR", "en-US"] // 한글과 영어 인식
            request.usesLanguageCorrection = true // 언어 교정 사용
            request.customWords = ["한글", "영어", "숫자"] // 자주 사용되는 단어 추가
            
            do {
                try requestHandler.perform([request])
            } catch {
                print("텍스트 인식 중 오류 발생: \(error)")
            }
        }
    }
    
    // 이미지 전처리 함수 - 메모리 최적화
    private func preprocessImage(_ image: UIImage) -> UIImage? {
        return autoreleasepool {
            guard let cgImage = image.cgImage else { return nil }
            
            let context = CIContext(options: [.useSoftwareRenderer: false]) // GPU 사용으로 메모리 절약
            let ciImage = CIImage(cgImage: cgImage)
            
            // 이미지 대비 향상
            let filter = CIFilter(name: "CIColorControls")
            filter?.setValue(ciImage, forKey: kCIInputImageKey)
            filter?.setValue(1.1, forKey: kCIInputContrastKey) // 대비 증가
            filter?.setValue(0.0, forKey: kCIInputBrightnessKey) // 밝기 조정
            filter?.setValue(1.0, forKey: kCIInputSaturationKey) // 채도 유지
            
            guard let outputImage = filter?.outputImage,
                  let processedCGImage = context.createCGImage(outputImage, from: outputImage.extent) else {
                return nil
            }
            
            return UIImage(cgImage: processedCGImage)
        }
    }
    
    // 이미지 크기 조정 함수 - 메모리 최적화
    private func resizeImage(_ image: UIImage, targetSize: CGSize) -> UIImage? {
        return autoreleasepool {
            let size = image.size
            
            let widthRatio  = targetSize.width  / size.width
            let heightRatio = targetSize.height / size.height
            
            let ratio = min(widthRatio, heightRatio)
            let newSize = CGSize(width: size.width * ratio, height: size.height * ratio)
                        
            let renderer = UIGraphicsImageRenderer(size: newSize)
            return renderer.image { _ in
                image.draw(in: CGRect(origin: .zero, size: newSize))
            }
        }
    }
    
    private func cleanupMemory() {
        processedImage = nil
        recognizedTexts = []
        translatedTexts = []
        showOverlay = false
        showTranslation = false
    }
}

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .images
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.presentationMode.wrappedValue.dismiss()
            
            guard let provider = results.first?.itemProvider else { return }
            
            if provider.canLoadObject(ofClass: UIImage.self) {
                provider.loadObject(ofClass: UIImage.self) { image, _ in
                    DispatchQueue.main.async {
                        self.parent.image = image as? UIImage ?? UIImage()
                    }
                }
            }
        }
    }
}

#Preview {
    ContentView()
} 
