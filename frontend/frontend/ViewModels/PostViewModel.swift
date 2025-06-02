import Foundation
import Combine
import UIKit

class PostViewModel: ObservableObject {
    @Published var posts: [Post] = []
    @Published var selectedPost: Post?
    @Published var isLoading = false
    @Published var error: String?

    
    func fetchPosts() async {

        Task{
            do{
                let posts = try await APIService.shared.fetchPosts()
                await MainActor.run {
                    self.posts = posts
                }
            }catch{
                await MainActor.run {
                   self.error = "게시글 목록을 불러오는데 실패했습니다: \(error.localizedDescription)"
                   self.isLoading = false
               }
            }
        }
    }

    func fetchPostDetail(postId: Int) async {

        Task {
            do {
                let post = try await APIService.shared.fetchPostDetail(postId: postId)
                await MainActor.run {
                    self.selectedPost = post
                    self.isLoading = false
                    self.error = nil
                }
            }catch{
                await MainActor.run {
                   self.error = "게시글을 불러오는데 실패했습니다: \(error.localizedDescription)"
                   self.isLoading = false
               }
            }
        }
    }
    
    func createPost(title: String, content: String, images: [UIImage]) async throws {
        isLoading = true
        defer { isLoading = false }
        
        let imageData = images.compactMap { image -> Data? in
            return image.jpegData(compressionQuality: 0.7)
        }
        
        let success = try await APIService.shared.createPost(title: title, content: content, files: imageData)
        if success {
            await MainActor.run {
                self.error = nil
            }
            await fetchPosts()
        } else {
            throw NSError(domain: "", code: -99, userInfo: [NSLocalizedDescriptionKey: "게시글 작성에 실패했습니다."])
        }
    }

    func updatePost(id: Int, title: String, content: String, images: [UIImage]) async throws {
        isLoading = true
        defer { isLoading = false }
        
        let imageData = images.compactMap { image -> Data? in
            return image.jpegData(compressionQuality: 0.7)
        }
        
        let success = try await APIService.shared.updatePost(id: id, title: title, content: content, files: imageData)
        if success {
            await MainActor.run {
                self.error = nil
            }
            await fetchPosts()
            
        } else {
            throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "게시글 수정에 실패했습니다."])
        }
    }

    func deletePost(id: Int) async throws {
        isLoading = true
        defer { isLoading = false }
        
        let success = try await APIService.shared.deletePost(id: id)
        if success {
            await MainActor.run {
                self.error = nil
                if let index = self.posts.firstIndex(where: { $0.id == id }) {
                    self.posts.remove(at: index)
                }
            }
        } else {
            throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "게시글 삭제에 실패했습니다."])
        }
    }
    
}
