import SwiftUI

struct SettingsView: View {
    @ObservedObject var authVM: AuthViewModel
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    Button(action: {
                        print("SettingsView        로그아웃")
                        authVM.logout()
                    }) {
                        HStack {
                            Text("로그아웃")
                                .foregroundColor(.red)
                            Spacer()
                            Image(systemName: "arrow.right.square")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationTitle("설정")
        }
    }
}

#Preview {
    SettingsView(authVM: AuthViewModel())
} 
