//
//  CameraView.swift
//  image2text
//
//  Created by mhb8436 on 5/26/25.
//

import SwiftUI
import AVFoundation

struct CameraView: UIViewRepresentable {
    
    @ObservedObject var viewModel: CameraViewModel
    
    func makeUIView (context: Context) -> UIView {
        let view = UIView(frame: UIScreen.main.bounds)
        
        guard let session = viewModel.session else { return view}
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.frame = view.frame
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        
        let captureButton = UIButton(frame: CGRect(x: 0, y: 0, width: 70, height: 70))
        captureButton.center = CGPoint(x: view.frame.width / 2, y: view.frame.height - 50)
        captureButton.backgroundColor = .white
        captureButton.layer.cornerRadius = 35
        captureButton.layer.borderWidth = 5
        captureButton.layer.borderColor = UIColor.gray.cgColor
        captureButton.addTarget(context.coordinator, action: #selector(Coordinator.capturePhoto), for: .touchUpInside)
        view.addSubview(captureButton)
        
        return view
    }
    

    func updateUIView(_ uiView: UIView, context: Context) {
        
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(parent : self)
    }
    
    class Coordinator: NSObject {
        let parent: CameraView
        
        init(parent: CameraView) {
            self.parent = parent
        }
        
        @objc func capturePhoto() {
            parent.viewModel.capturePhoto()
        }
    }
}

#Preview {
    
}
