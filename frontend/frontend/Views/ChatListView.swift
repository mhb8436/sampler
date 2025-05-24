import SwiftUI

struct ChatListView: View {
    @State private var showingCreateRoomAlert = false
    @State private var newRoomName = ""
    @State private var isCreatingRoom = false
    @State private var createRoomError: String?
    @State private var selectedRoom: ChatRoom?

    @ObservedObject var viewModel: ChatListViewModel

    var body: some View {
        NavigationStack {
            List(viewModel.rooms) { room in
                Button(action: {
                    selectedRoom = room
                }) {
                   
                    HStack {
                        Text(room.name)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundColor(.gray)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(PlainButtonStyle())
            }
            .navigationTitle("채팅방 목록")
            .toolbar {
                Button("방 만들기") {
                    showingCreateRoomAlert = true
                }
            }
            .navigationDestination(item: $selectedRoom) { room in                
                ChatRoomView(chatRoomId: room.id)
            }
        }
        .onAppear {
            viewModel.fetchRooms()
        }.alert("방 이름 입력", isPresented: $showingCreateRoomAlert) {
        VStack {
            TextField("방 이름", text: $newRoomName)
            Button("생성") {
                Task {
                    isCreatingRoom = true
                    do {
                        let result = try await APIService.shared.createChatRoom(name: newRoomName)
                        if result {
                            viewModel.fetchRooms()
                            newRoomName = ""
                        } else {
                            createRoomError = "방 생성 실패"
                        }
                    } catch {
                        createRoomError = "오류: \(error.localizedDescription)"
                    }
                    isCreatingRoom = false
                }
            }
            Button("취소", role: .cancel) {}
        }
    } message: {
        if let error = createRoomError {
            Text(error)
        }
    }
    }
    
}

#Preview {
    ChatListView(viewModel: ChatListViewModel())
}
