import SwiftUI

struct PostDetailView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var viewModel: PostViewModel
    let post: Post
    @State private var showingEditSheet = false
    @State private var showingDeleteAlert = false
    @State private var isLoading = false
    @State private var error: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // 제목과 작성자 정보
                VStack(alignment: .leading, spacing: 8) {
                    Text(post.title)
                        .font(.title2)
                        .bold()
                    
                    HStack {
                        Text(post.user.nickname)
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        Spacer()
                        Text(post.createdAt)
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal)
                
                Divider()
                
                // 내용
                Text(post.content)
                    .padding(.horizontal)
                
                // 첨부파일
                if let files = post.files, !files.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("첨부파일")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(files) { file in
                                    AsyncImage(url: URL(string: file.url)) { image in
                                        image
                                            .resizable()
                                            .scaledToFill()
                                    } placeholder: {
                                        ProgressView()
                                    }
                                    .frame(width: 200, height: 200)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                                    )
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                }
                
                Divider()
                
                // 댓글 섹션
                VStack(alignment: .leading, spacing: 8) {
                    Text("댓글")
                        .font(.headline)
                        .padding(.horizontal)
                    
                    if post.answers.isEmpty {
                        Text("댓글이 없습니다.")
                            .foregroundColor(.gray)
                            .padding(.horizontal)
                    } else {
                        ForEach(post.answers) { answer in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(answer.user.nickname)
                                        .font(.subheadline)
                                        .bold()
                                    Spacer()
                                    Text(answer.createdAt)
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                Text(answer.content)
                                    .font(.body)
                            }
                            .padding()
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                            .padding(.horizontal)
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button(action: {
                        showingEditSheet = true
                    }) {
                        Label("수정", systemImage: "pencil")
                    }
                    
                    Button(role: .destructive, action: {
                        showingDeleteAlert = true
                    }) {
                        Label("삭제", systemImage: "trash")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
        .sheet(isPresented: $showingEditSheet) {
            PostEditView(viewModel: viewModel, post: post)
        }
        .alert("게시글 삭제", isPresented: $showingDeleteAlert) {
            Button("삭제", role: .destructive) {
                Task {
                    await deletePost()
                }
            }
            Button("취소", role: .cancel) {}
        } message: {
            Text("정말로 이 게시글을 삭제하시겠습니까?")
        }
        .alert("오류", isPresented: .constant(error != nil)) {
            Button("확인") {
                error = nil
            }
        } message: {
            if let error = error {
                Text(error)
            }
        }
    }
    
    private func deletePost() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            try await viewModel.deletePost(id: post.id)
            dismiss()
        } catch {
            self.error = error.localizedDescription
        }
    }
}

#Preview {

}
