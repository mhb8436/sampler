
import SwiftUI
import PhotosUI

struct PostEditView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var viewModel: PostViewModel
    @State private var title: String
    @State private var content: String
    @State private var selectedImages: [UIImage] = []
    @State private var showingImagePicker = false
    @State private var showingDeleteAlert = false
    @State private var isLoading = false
    @State private var error: String?
    
    private let post: Post?
    private let isEditing: Bool
    
    init(viewModel: PostViewModel, post: Post? = nil) {
        self.viewModel = viewModel
        self.post = post
        self.isEditing = post != nil
        _title = State(initialValue: post?.title ?? "")
        _content = State(initialValue: post?.content ?? "")
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("제목")) {
                    TextField("제목을 입력하세요", text: $title)
                }
                
                Section(header: Text("내용")) {
                    TextEditor(text: $content)
                        .frame(minHeight: 200)
                }
                
                Section(header: Text("첨부파일")) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(selectedImages, id: \.self) { image in
                                Image(uiImage: image)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 100, height: 100)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    .overlay(
                                        Button(action: {
                                            if let index = selectedImages.firstIndex(of: image) {
                                                selectedImages.remove(at: index)
                                            }
                                        }) {
                                            Image(systemName: "xmark.circle.fill")
                                                .foregroundColor(.red)
                                                .background(Color.white)
                                                .clipShape(Circle())
                                        }
                                        .padding(4),
                                        alignment: .topTrailing
                                    )
                            }
                            
                            Button(action: {
                                showingImagePicker = true
                            }) {
                                VStack {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.system(size: 30))
                                    Text("이미지 추가")
                                        .font(.caption)
                                }
                                .frame(width: 100, height: 100)
                                .background(Color.gray.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                        }
                        .padding(.vertical, 8)
                    }
                }
                
                if isEditing {
                    Section {
                        Button(role: .destructive, action: {
                            showingDeleteAlert = true
                        }) {
                            HStack {
                                Spacer()
                                Text("게시글 삭제")
                                Spacer()
                            }
                        }
                    }
                }
            }
            .navigationTitle(isEditing ? "게시글 수정" : "새 게시글")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("취소") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(isEditing ? "수정" : "등록") {
                        Task {
                            await savePost()
                        }
                    }
                    .disabled(title.isEmpty || content.isEmpty || isLoading)
                }
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
            .photosPicker(isPresented: $showingImagePicker,
                         selection: Binding(
                            get: { [] },
                            set: { newValue in
                                Task {
                                    for item in newValue {
                                        if let data = try? await item.loadTransferable(type: Data.self),
                                           let image = UIImage(data: data) {
                                            await MainActor.run {
                                                selectedImages.append(image)
                                            }
                                        }
                                    }
                                }
                            }
                         ),
                         matching: .images)
        }
    }
    
    private func savePost() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            if isEditing, let post = post {
                try await viewModel.updatePost(id: post.id, title: title, content: content, images: selectedImages)
            } else {
                try await viewModel.createPost(title: title, content: content, images: selectedImages)
            }
            dismiss()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    private func deletePost() async {
        guard let post = post else { return }
        
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
