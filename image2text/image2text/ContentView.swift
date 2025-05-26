import SwiftUI
import Vision
import PhotosUI

struct RecognizedText: Identifiable {
    let id = UUID()
    let string: String
    let boundingBox: CGRect
}

struct ContentView: View {
    @StateObject private var cameraViewModel = CameraViewModel()
    @State private var recognizedTexts: [RecognizedText] = []
    @State private var showOverlay: Bool = false
    @State private var showImagePicker: Bool = false
    @State private var processedImage: UIImage? // OCR 처리된 이미지를 저장
    
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
            
            HStack {
                #if targetEnvironment(simulator)
                Button(action: {
                    showImagePicker = true
                }) {
                    Text("이미지 선택")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
                #endif
                
                Button(action: {
                    if let image = cameraViewModel.capturedImage {
                        // 이미지 전처리 및 크기 조정
                        if let resizedImage = resizeImage(image, targetSize: CGSize(width: 2000, height: 2000)),
                           let processedImage = preprocessImage(resizedImage) {
                            recognizeText(from: processedImage)
                        } else {
                            recognizeText(from: image)
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
                
                if cameraViewModel.capturedImage != nil {
                    Button(action: {
                        showOverlay.toggle()
                    }) {
                        Text(showOverlay ? "오버레이 숨기기" : "오버레이 보기")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.green)
                            .cornerRadius(10)
                    }
                }
                
                if processedImage != nil {
                    Button(action: {
                        // 원본 이미지로 돌아가기
                        processedImage = nil
                        recognizedTexts = []
                        showOverlay = false
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
                    ForEach(recognizedTexts, id: \.id) { text in
                        Text(text.string)
                            .padding(.horizontal)
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
                    showOverlay = false
                }
            ))
        }
    }
    
    private func recognizeText(from image: UIImage) {
        guard let cgImage = image.cgImage else { return }
        
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
                self.showOverlay = true
                
                // OCR 처리된 이미지 생성
                UIGraphicsBeginImageContextWithOptions(image.size, false, 0.0)
                image.draw(at: .zero)
                
                let context = UIGraphicsGetCurrentContext()
                context?.setStrokeColor(UIColor.red.cgColor)
                context?.setLineWidth(2.0)
                
                // 인식된 텍스트 영역에 박스 그리기
                for text in recognizedTexts {
                    let rect = CGRect(
                        x: text.boundingBox.minX * image.size.width,
                        y: text.boundingBox.minY * image.size.height,
                        width: text.boundingBox.width * image.size.width,
                        height: text.boundingBox.height * image.size.height
                    )
                    context?.stroke(rect)
                }
                
                if let processedImage = UIGraphicsGetImageFromCurrentImageContext() {
                    self.processedImage = processedImage
                }
                
                UIGraphicsEndImageContext()
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
    
    // 이미지 전처리 함수 추가
    private func preprocessImage(_ image: UIImage) -> UIImage? {
        guard let cgImage = image.cgImage else { return nil }
        
        let context = CIContext()
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
    
    // 이미지 크기 조정 함수 추가
    private func resizeImage(_ image: UIImage, targetSize: CGSize) -> UIImage? {
        let size = image.size
        
        let widthRatio  = targetSize.width  / size.width
        let heightRatio = targetSize.height / size.height
        
        let ratio = min(widthRatio, heightRatio)
        let newSize = CGSize(width: size.width * ratio, height: size.height * ratio)
        
        UIGraphicsBeginImageContextWithOptions(newSize, false, 0.0)
        image.draw(in: CGRect(origin: .zero, size: newSize))
        let resizedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return resizedImage
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
