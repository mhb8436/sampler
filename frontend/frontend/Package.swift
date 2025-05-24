// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "frontend",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "frontend",
            targets: ["frontend"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.7.0"),
        .package(url: "https://github.com/daltoniam/Starscream.git", from: "4.0.0"),
        .package(url: "https://github.com/socketio/socket.io-client-swift", from: "16.0.1")
    ],
    targets: [
        .target(
            name: "frontend",
            dependencies: ["Alamofire", "Starscream", "SocketIO"]),
        .testTarget(
            name: "frontendTests",
            dependencies: ["frontend"]),
    ]
)
