export default function ChatWindow({
  consultations,
  selectedChat,
  setSelectedChat,
  replyMessage,
  setReplyMessage,
  handleSendReply
}) {
  return (
    <>
      <div className="w-1/3 bg-white rounded-lg shadow overflow-y-auto">
        {consultations.map((consultation) => (
          <div
            key={consultation._id}
            onClick={() => setSelectedChat(consultation)}
            className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
              selectedChat?._id === consultation._id ? 'bg-purple-50' : ''
            }`}
          >
            <div>
              <h3 className="font-medium text-purple-800">
                {consultation.username}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {consultation.messages[consultation.messages.length - 1]?.content}
              </p>
              <div className="flex justify-end mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(consultation.updatedAt).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-medium text-purple-800">{selectedChat.username}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex ${
                    msg.role === 'doctor' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.role === 'doctor'
                      ? 'bg-purple-100'
                      : 'bg-gray-100'
                  }`}>
                    <p>{msg.content}</p>
                    <small className="text-gray-500 block mt-1">
                      {new Date(msg.timestamp).toLocaleString('id-ID')}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                  placeholder="Ketik balasan..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  Kirim
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Pilih percakapan untuk memulai konsultasi
          </div>
        )}
      </div>
    </>
  );
}