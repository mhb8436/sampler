import SwiftUI
import Vision
import PhotosUI
import Translation

// OCR 인식된 텍스트를 저장하는 모델
struct RecognizedText: Identifiable {
    let id = UUID()
    let string: String // 인식된 텍스트
    let boundingBox: CGRect // 인식된 텍스트의 박스 좌표
}

// 번역된 텍스트를 저장하는 모델
struct TranslatedText: Identifiable {
    let id = UUID()
    let originalText: String // 원본 텍스트
    let translatedText: String // 번역된 텍스트
    let boundingBox: CGRect // 번역된 텍스트의 박스 좌표
}

struct ContentView: View {
    // 카메라 뷰모델
    @StateObject private var cameraViewModel = CameraViewModel()
    // OCR 인식된 텍스트를 저장하는 배열
    @State private var recognizedTexts: [RecognizedText] = []
    // 번역된 텍스트를 저장하는 배열
    @State private var translatedTexts: [TranslatedText] = []
    // 오버레이 표시 여부
    @State private var showOverlay: Bool = false
    // OCR 처리된 이미지를 저장
    @State private var processedImage: UIImage? // OCR 처리된 이미지를 저장
    @State private var showTranslation: Bool = false // 번역 표시 여부
    @State private var sourceLanguage: Locale.Language = Locale.Language(identifier: "ko") // 원본 언어
    @State private var targetLanguage: Locale.Language = Locale.Language(identifier: "en") // 번역 언어
    @State private var isTranslating: Bool = false // 번역 중 여부
    @State private var translationConfiguration: TranslationSession.Configuration?


    // 뷰 본문
    var body: some View {
        VStack {
            ZStack {
                // 카메라에서 캡쳐된 이미지
                if let image = processedImage ?? cameraViewModel.capturedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 300)
                        .cornerRadius(12)
                        .padding()
                } else {
                    // 카메라 뷰 모델을 사용하여 카메라 뷰 표시
                    CameraView(viewModel: cameraViewModel)
                        .frame(height: 300)
                        .cornerRadius(12)
                        .padding()
                }
                // 카메라 뷰모델에서 캡쳐된 이미지가 있으면 오버레이 표시
                if showOverlay, let image = processedImage ?? cameraViewModel.capturedImage {
                    GeometryReader { geometry in
                        ZStack {
                            // 이미지 표시 
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFit()
                                .frame(width: geometry.size.width)
                            // 번역이 되었으면 번역된 텍스트 그리기 

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
                                // 아니면 OCR 인식된 텍스트 그리기 
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
            // OCR 인식된 텍스트가 있으면 언어 선택 UI 표시
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
                // OCR 인식 버튼
                Button(action: {
                    // 카메라 뷰모델에서 캡쳐된 이미지가 있으면 이미지 처리
                    if let image = cameraViewModel.capturedImage {
                        // 메모리 최적화: autoreleasepool 사용
                        autoreleasepool {
                            // 이미지 크기 조정 시도
                            let imageToProcess = resizeImage(image, targetSize: CGSize(width: 1024, height: 1024)) ?? image

                            // 전처리 시도
                            if let processedImage = preprocessImage(imageToProcess) {
                                // 이미지 처리
                                recognizeText(from: processedImage)
                            } else {
                                // 이미지 처리
                                recognizeText(from: imageToProcess)
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
                
                // OCR 인식된 텍스트가 있으면 번역 버튼 표시
                if !recognizedTexts.isEmpty {
                    // 번역 버튼
                    Button(action: {
                        translateTexts()
                    }) {
                        HStack {
                            // 번역 중 표시
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
                
                // 카메라 뷰모델에서 캡쳐된 이미지가 있으면 오버레이 표시 버튼 표시
                if cameraViewModel.capturedImage != nil {
                    // 오버레이 표시 버튼
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
                
                // OCR 인식된 이미지가 있으면 원본으로 버튼 표시
                if processedImage != nil {
                    // 원본으로 버튼
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
            
            // 스크롤 뷰
            ScrollView {
                // 번역된 텍스트가 있으면 번역된 텍스트 표시
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
        // TranslationSession을 위한 translationTask modifier 추가
        .translationTask(translationConfiguration) { session in
            await performTranslations(using: session)
        }
    }
    
    // 번역 함수 수정
    private func translateTexts() {
        // OCR 인식된 텍스트가 있으면 번역 수행
        guard !recognizedTexts.isEmpty else { return }
        // 번역 중 표시
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
    // OCR 인식 함수
    private func recognizeText(from image: UIImage) {
        guard let cgImage = image.cgImage else { return }
        
        // 메모리 최적화: autoreleasepool 사용
        autoreleasepool {
            // OCR 인식 요청 생성
            let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
            // OCR 인식 요청 생성
            let request = VNRecognizeTextRequest { request, error in
                guard let observations = request.results as? [VNRecognizedTextObservation],
                      error == nil else {
                    return
                }
                // OCR 인식 결과 처리
                let recognizedTexts = observations.compactMap { observation -> RecognizedText? in
                    // 상위 3개의 인식 결과를 확인하고 신뢰도가 높은 결과 선택
                    let candidates = observation.topCandidates(3)
                    // 신뢰도가 50% 이상인 결과만 사용
                    guard let topCandidate = candidates.first,
                          topCandidate.confidence > 0.5 else { return nil } // 신뢰도가 50% 이상인 결과만 사용
                    
                    // 박스 좌표 변환
                    let boundingBox = observation.boundingBox
                    // 박스 좌표 변환
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
                        // 이미지 컨텍스트 생성
                        UIGraphicsBeginImageContextWithOptions(scaledSize, false, 0.0)
                        image.draw(in: CGRect(origin: .zero, size: scaledSize))
                        // 이미지 컨텍스트 생성
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
                        // 이미지 컨텍스트 생성
                        if let processedImage = UIGraphicsGetImageFromCurrentImageContext() {
                            self.processedImage = processedImage
                        }
                        // 이미지 컨텍스트 종료
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

#Preview {
    ContentView()
} 
