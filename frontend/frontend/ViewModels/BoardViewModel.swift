import Foundation
import Combine

class BoardViewModel: ObservableObject {
    @Published var posts: [Post] = []
    @Published var selectedPost: Post?

    
    func fetchPosts() async {

        Task{
            do{
                let posts = try await APIService.shared.fetchPosts()
                await MainActor.run {
                    self.posts = posts
                }
            }catch{
                
            }
        }
    }

    func fetchPostDetail(postId: Int) async {

        Task {
            do {
                let post = try await APIService.shared.fetchPostDetail(postId: postId)
                await MainActor.run {
                    self.selectedPost = post
                }
            }catch{
                
            }
        }
    }
}
