//
//  frontendApp.swift
//  frontend
//
//  Created by mhb8436 on 2025/05/24.
//

import SwiftUI

@main
struct frontendApp: App {
    @StateObject var authVM = AuthViewModel()
        var body: some Scene {
            WindowGroup {
                if authVM.isLoggedIn, let token = authVM.token {
                    MainTabView(token: token)
                } else {
                    AuthView(viewModel: authVM)
                }
            }
        }
    }

    struct MainTabView: View {
        let token: String
        @StateObject var boardVM = BoardViewModel()
        @StateObject var chatListVM = ChatListViewModel()
        
        init(token: String) {
            self.token = token

        }
        var body: some View {
            TabView {
                BoardView(viewModel: boardVM)
                    .tabItem { Label("게시판", systemImage: "doc.text") }
                ChatListView(viewModel: chatListVM)
                    .tabItem { Label("채팅", systemImage: "bubble.left.and.bubble.right") }
            }
        }
}
