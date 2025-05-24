import Foundation

struct User: Codable, Identifiable {
    let id: Int
    let email: String
    let nickname: String
}
