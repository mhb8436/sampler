import Foundation

struct Answer: Codable, Identifiable {
    let id: Int
    let content: String
    let createdAt: String
    let user: User
}
