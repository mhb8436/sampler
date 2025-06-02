import Foundation
import Combine

class AuthViewModel: ObservableObject {
    @Published var token: String?
    @Published var isLoggedIn = false
    @Published var loginError: String?
    @Published var signupError: String?
    @Published var role : String?

    private let tokenKey = "jwt_token"

    init() {
       
        // 앱 실행 시 토큰 불러오기\
        if let savedToken = UserDefaults.standard.string(forKey: tokenKey) {
            self.token = savedToken
            self.isLoggedIn = true
        }
    }

    func login(email: String, password: String) async {
        Task{
            do {
                print("viewModel login : \(email) \(password)")
                if let token = try await APIService.shared.login(email: email, password: password) {
                    await MainActor.run {
                        print(token)
                        self.token = token
                        self.isLoggedIn = true
                        UserDefaults.standard.set(token, forKey: self.tokenKey)
                    }
                }else{
                    await MainActor.run {
                        self.loginError = "로그인 실패"
                    }
                }
            }catch{
                await MainActor.run {
                    self.loginError = "로그인 실패"
                }
            }
        }
        
    }

    func signup(email: String, password: String, nickname: String) async {
        Task {
            do {
                let success = try await APIService.shared.signup(email: email, password: password, nickname: nickname)
                print("viewModel signup : \(success)")
                if success {
                    await MainActor.run {
                        self.signupError = nil
                    }
                }else {
                    await MainActor.run {
                        self.signupError = "회원가입실패"
                    }
                }
                
            }catch{
                await MainActor.run {
                    self.signupError = "회원가입실패"
                }
            }
        }
        
        
    }

    func logout() {
        self.token = nil
        self.isLoggedIn = false
        UserDefaults.standard.removeObject(forKey: tokenKey)
    }
}

