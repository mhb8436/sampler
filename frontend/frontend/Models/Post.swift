import Foundation

struct Post: Codable, Identifiable {
    let id: Int
    let title: String
    let content: String
    let createdAt: String
    let user: User
    let answers: [Answer]
    let files: [File]?
}


struct File: Codable, Identifiable {
    let id: Int
    let originalName: String
    let url : String
    let createdAt: String
}

