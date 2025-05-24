import SwiftUI

struct BoardView: View {
    @State private var showingCreatePostAlert = false
    @State private var newPostTitle = ""
    @State private var newPostContent = ""
    @State private var isCreatingPost = false
    @State private var createPostError: String?
    var token: String = "" // 필요시 외부에서 주입
    @ObservedObject var viewModel: BoardViewModel

    var body: some View {
        NavigationView {
            List(viewModel.posts) { post in
                NavigationLink(destination: PostDetailView(post: post)) {
                    VStack(alignment: .leading) {
                        Text(post.title).font(.headline)
                        Text(post.content).font(.subheadline).lineLimit(2)
                    }
                }
            }
            .navigationTitle("게시판")
            .toolbar {
                Button("글쓰기") {
                    showingCreatePostAlert = true
                }
            }
        }
        .onAppear {
            Task {
                    await viewModel.fetchPosts()
            }
            
        }
        .alert("글 작성", isPresented: $showingCreatePostAlert) {
            VStack {
                TextField("제목", text: $newPostTitle)
                TextField("내용", text: $newPostContent)
                Button("등록") {
                    Task {
                        isCreatingPost = true
                        do {
                            let result = try await APIService.shared.createPost(title: newPostTitle, content: newPostContent, token: token)
                            
                            if result {
                                Task{
                                    await viewModel.fetchPosts()
                                    newPostTitle = ""
                                    newPostContent = ""
                                }
                                
                            } else {
                                createPostError = "글 작성 실패"
                            }
                        } catch {
                            createPostError = "오류: \(error.localizedDescription)"
                        }
                        isCreatingPost = false
                    }
                }
                Button("취소", role: .cancel) {}
            }
        } message: {
            if let error = createPostError {
                Text(error)
            }
        }
    }
}


#Preview {
    BoardView(viewModel: BoardViewModel())
}
