import SwiftUI

struct PostDetailView: View {
    let post: Post

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(post.title).font(.title2).bold()
            Text(post.content)
            Divider()
            Text("댓글")
                .font(.headline)
            List(post.answers) { answer in
                VStack(alignment: .leading) {
                    Text(answer.user.nickname).font(.subheadline).bold()
                    Text(answer.content)
                }
            }
        }
        .padding()
        .navigationTitle("게시글")
    }
}
