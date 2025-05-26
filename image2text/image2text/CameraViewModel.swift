//
//  CameraViewModel.swift
//  image2text
//
//  Created by mhb8436 on 5/26/25.
//

import SwiftUI
import AVFoundation

class CameraViewModel : NSObject, ObservableObject {
    var session: AVCaptureSession?
    var photoOutput: AVCapturePhotoOutput?
    
    @Published var capturedImage: UIImage?
    @Published var isAuthorized = false
    
    override init() {
        super.init()
        
        checkPermission()
    }
    
    func checkPermission() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            isAuthorized = true
            setUpCamera()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    self?.isAuthorized = granted
                    if granted {
                        self?.setUpCamera()
                    }
                }
            }
        default:
            isAuthorized = false
        }
    }
    
    func setUpCamera() {
        let session = AVCaptureSession()
        session.sessionPreset = .photo
        
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for:.video, position: .back),
              let input = try? AVCaptureDeviceInput(device: device) else{
            return
        }
        
        let photoOutput = AVCapturePhotoOutput()
        
        if session.canAddInput(input) && session.canAddOutput(photoOutput) {
            session.addInput(input)
            session.addOutput(photoOutput)
            
            self.session = session
            self.photoOutput = photoOutput
            
            DispatchQueue.global(qos: .userInitiated).async { [weak self] in
                self?.session?.startRunning()
            }
        }
    }
    
    func capturePhoto() {
        guard let photoOutput = photoOutput else {
            return
        }
        
        let settings = AVCapturePhotoSettings()
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
}


extension CameraViewModel : AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("사진 캡처 중 오류 발생 : \(error)")
            return
        }
        
        guard let imageData = photo.fileDataRepresentation(),
              let image = UIImage(data: imageData) else {
            return
        }
        DispatchQueue.main.async { [weak self] in
            self?.capturedImage = image
        }
    }
}
