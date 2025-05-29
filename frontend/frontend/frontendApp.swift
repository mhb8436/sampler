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
    @StateObject var boardVM = PostViewModel()
    @StateObject var chatListVM = ChatListViewModel()
    @StateObject var authVM = AuthViewModel()
    
    init(token: String) {
        self.token = token
    }
    
    var body: some View {
        TabView {
            PostView(viewModel: boardVM)
                .tabItem { Label("게시판", systemImage: "doc.text") }
            ChatListView(viewModel: chatListVM)
                .tabItem { Label("채팅", systemImage: "bubble.left.and.bubble.right") }
            SettingsView(authVM: authVM)
                .tabItem { Label("설정", systemImage: "gear") }
        }
    }
}
