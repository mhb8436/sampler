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
        let view = UIView()
        
        guard let session = viewModel.session else { return view}
        
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        
        let captureButton = UIButton()
        captureButton.backgroundColor = .white
        captureButton.layer.cornerRadius = 35
        captureButton.layer.borderWidth = 5
        captureButton.layer.borderColor = UIColor.gray.cgColor
        captureButton.addTarget(context.coordinator, action: #selector(Coordinator.capturePhoto), for: .touchUpInside)
        
        captureButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(captureButton)
        
        NSLayoutConstraint.activate([
            captureButton.widthAnchor.constraint(equalToConstant: 70),
            captureButton.heightAnchor.constraint(equalToConstant: 70),
            captureButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            captureButton.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -20)
        ])
        
        DispatchQueue.main.async {
            previewLayer.frame = view.bounds
        }
        
        return view
    }
    

    func updateUIView(_ uiView: UIView, context: Context) {
        if let previewLayer = uiView.layer.sublayers?.first as? AVCaptureVideoPreviewLayer {
            previewLayer.frame = uiView.bounds
        }
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
    CameraView(viewModel: CameraViewModel())
}
