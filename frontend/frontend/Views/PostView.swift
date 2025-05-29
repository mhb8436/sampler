import SwiftUI

struct PostView: View {
    @ObservedObject var viewModel: PostViewModel
    @State private var showingCreatePost = false
    @State private var isLoading = false
    @State private var error: String?
    
    var body: some View {
        NavigationView {
            Group {
                if viewModel.isLoading {
                    ProgressView()
                } else if let error = viewModel.error {
                    VStack {
                        Text(error)
                            .foregroundColor(.red)
                        Button("다시 시도") {
                            Task{
                                await viewModel.fetchPosts()
                            }
                            
                        }
                    }
                } else {
                    List(viewModel.posts) { post in
                        NavigationLink(destination: PostDetailView(viewModel: viewModel, post: post)) {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(post.title)
                                    .font(.headline)
                                    .lineLimit(1)
                                
                                Text(post.content)
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                    .lineLimit(2)
                                
                                HStack {
                                    Text(post.user.nickname)
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                    
                                    Spacer()
                                    
                                    if let files = post.files, !files.isEmpty {
                                        Label("\(files.count)", systemImage: "paperclip")
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Text(post.createdAt)
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .refreshable {
                        await viewModel.fetchPosts()
                    }
                }
            }
            .navigationTitle("게시판")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading){
                    Button(action : {
                        
                    }) {
                        Image(systemName: "logout")
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingCreatePost = true
                    }) {
                        Image(systemName: "square.and.pencil")
                    }
                }
            }
            .sheet(isPresented: $showingCreatePost) {
                PostEditView(viewModel: viewModel)
            }
        }
        .onAppear {
            Task{
                await viewModel.fetchPosts()
            }
            
        }
    }
}


#Preview {
    PostView(viewModel: PostViewModel())
}
