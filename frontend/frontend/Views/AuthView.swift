import SwiftUI

struct AuthView: View {
    @ObservedObject var viewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var nickname = ""
    @State private var isSignup = false

    var body: some View {
        VStack {
            TextField("이메일", text: $email)
                .autocapitalization(.none)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            SecureField("비밀번호", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            if isSignup {
                TextField("닉네임", text: $nickname)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            Button(isSignup ? "회원가입" : "로그인") {
                if isSignup {
                    Task {
                        print("sigunUp : \(email) \(password) \(nickname)")
                        let success = await viewModel.signup(email: email, password: password, nickname: nickname)
                        isSignup = false
                    }
                } else {
                    Task {
                        await viewModel.login(email: email, password: password)
                    }
                }
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            Button(isSignup ? "로그인하기" : "회원가입하기") {
                isSignup.toggle()
            }
            .padding(.top, 8)
            if let error = isSignup ? viewModel.signupError : viewModel.loginError {
                Text(error).foregroundColor(.red)
            }
        }
        .padding()
    }
}

#Preview {
    AuthView(viewModel: AuthViewModel())
}

