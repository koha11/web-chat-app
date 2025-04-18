import { FormEvent, useEffect, useRef, useState } from 'react';
import { getData, postData } from '../../services/api';
import { useParams } from 'react-router-dom';
import { SingleMsg } from '../../components/SingleMsg';
import WebSocketConnection from '../../services/WebSocketConnection';
import { Socket } from 'socket.io-client';
import { List } from 'postcss/lib/list';

const ChatDetails = () => {
  const { id } = useParams();

  // const [chatDetails, setChatDetails] = useState<ChatDetailsProps>();
  const [msgList, setMsgList] = useState<[msgObject]>();
  const [isScrollBottom, setIsScrollBottom] = useState(false);
  const [msgBody, setMsgBody] = useState('');

  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const lastMsgTime = useRef<Date>(null);

  const socketRef = useRef<Socket>(null);
  const UsersRef = useRef<Users>(null);

  // Dùng để lấy các tin nhắn sau khi chuyển sang đoạn chat khác
  useEffect(() => {
    getData(`/m/get-messages/${id}`).then((data) => {
      setMsgList(data.msgList);
      setIsScrollBottom(!isScrollBottom);
      UsersRef.current = { sender: data.sender, receiver: data.receiver };
      socketRef.current = WebSocketConnection.getConnection();

      socketRef.current.on('sendMsgFromServer', (msg: msgObject) => {
        setMsgList((oldMsgs: [msgObject]) => [...oldMsgs, msg]);
      });

      socketRef.current.on('soIsTyping', (chatID: string) => {
        console.log(chatID + 'is typing');
      });

      return () => {
        socketRef.current?.removeAllListeners('sendMsgFromServer');
        socketRef.current?.disconnect();
      };
    });
  }, [id]);

  useEffect(() => {
    handleScrollToBot();
  }, [isScrollBottom]);

  const handleSendMsg = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    if (formData.msgBody == '') return;

    postData('/m/send-message/' + id, {
      user: UsersRef.current?.sender.id,
      msgBody: formData.msgBody,
    }).then(({ status, data }) => {
      if (status == 1) {
        socketRef.current!.emit('sendMsgFromClient', data, id);
        setMsgList([...msgList, data]);
        setMsgBody('');
        setIsScrollBottom(!isScrollBottom);
      }
    });
  };

  const handleScrollToBot = () => {
    const msgListRef =
      msgsContainerRef.current?.querySelectorAll('.single-msg');

    msgListRef?.item(msgListRef.length - 1)?.scrollIntoView();
  };

  const handleOnTyping = (e: FormEvent<HTMLInputElement>) => {
    setMsgBody(e.currentTarget.value);
    socketRef.current?.emit('isTyping', id);
  };

  return (
    <section
      className="w-[75%] h-full p-4 bg-white rounded-2xl"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 5px 2px' }}
    >
      <div className="container flex items-center justify-between h-[10%]">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: 'url(/assets/images/test.jpg)' }}
          ></div>
          <div className="ml-4">
            <h1 className="font-bold">{UsersRef.current?.receiver.fullname}</h1>
            <div className="text-gray-500 text-[0.75rem]">
              {UsersRef.current?.receiver.isOnline
                ? 'Đang hoạt động'
                : 'Không hoạt động'}
            </div>
          </div>
        </div>
        <div className="text-2xl">
          <a href="">
            <i className="bx bx-phone p-2 rounded-full hover:bg-gray-200"></i>
          </a>
          <a href="">
            <i className="bx bxs-video p-2 rounded-full hover:bg-gray-200"></i>
          </a>
          <a href="">
            <i className="bx bx-dots-horizontal-rounded p-2 rounded-full hover:bg-gray-200"></i>
          </a>
        </div>
      </div>

      <div
        className="container h-[85%] overflow-y-scroll flex flex-col text-[0.9rem] py-4"
        ref={msgsContainerRef}
      >
        {msgList?.map((msg) => {
          const isSentMsg = msg.user == UsersRef.current!.sender.id;
          const timeSpan = new Date(msg.time);

          let timeString = '';

          // Hiệu giữa thời gian hiện tại với thời gian của tin nhắn
          const diffTime = new Date().getTime() - timeSpan.getTime();

          // Nếu tin nhắn được nhắn trong ngày
          if (timeSpan.getDay() == new Date().getDay())
            timeString = timeSpan.toLocaleTimeString('vi-VN').slice(0, 5);
          // Nếu tin nhắn được nhắn trong vòng 7 ngày đổ lại
          else if (diffTime / (1000 * 60 * 60 * 24) <= 7) {
            timeString = timeSpan.toLocaleTimeString('vi-VN', {
              weekday: 'short',
            });

            timeString = timeString.slice(0, 5).concat(timeString.slice(8, 13));

            // Mặc định (tin nhắn xa hơn 7 ngày)
          } else {
            timeString = timeSpan.toLocaleTimeString('vi-VN', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            });
            timeString = timeString.slice(0, 5).concat(timeString.slice(8));
          }

          // Dưới 20 phút thì ko cần hiện thời gian
          const hasTimeSpan =
            lastMsgTime.current == null
              ? true
              : (timeSpan.getTime() - lastMsgTime.current?.getTime()) /
                  (1000 * 60) >
                20;

          const isLongGap =
            lastMsgTime.current == null
              ? true
              : (timeSpan.getTime() - lastMsgTime.current?.getTime()) / 1000 >
                60;

          lastMsgTime.current = timeSpan;

          return (
            <>
              {hasTimeSpan && (
                <div
                  key={'T' + msg.id}
                  className="msg-time text-center text-gray-400 text-[0.75rem]"
                >
                  {timeString}
                </div>
              )}
              <SingleMsg
                key={msg.id}
                isSentMsg={isSentMsg}
                isLongGap={isLongGap}
                body={msg.body}
                avatar="/assets/images/test.jpg"
              ></SingleMsg>
            </>
          );
        })}
      </div>

      <div className="container h-[5%]">
        <form
          action=""
          className="relative w-full flex items-center justify-between"
          onSubmit={handleSendMsg}
        >
          <label
            htmlFor="uploaded-image"
            className="rounded-full mr-2 cursor-pointer"
          >
            <i className="bx bx-image text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </label>
          {/* <input id="uploaded-image" type="file" className="hidden"></input>   */}
          <input
            name="msgBody"
            className="rounded-3xl flex-auto bg-gray-200 px-4 py-2 text-gray-500"
            placeholder="Aa"
            value={msgBody}
            onChange={handleOnTyping}
          ></input>
          <input
            name="user"
            type="hidden"
            value={UsersRef.current?.sender.id}
          ></input>
          <input
            name="receiver"
            type="hidden"
            value={UsersRef.current?.receiver.id}
          ></input>

          <button className="rounded-full ml-2 cursor-pointer" type="submit">
            <i className="bx bx-send text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </button>
          <button className="rounded-full ml-2 cursor-pointer">
            <i className="bx bxs-hand text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </button>
        </form>
      </div>
    </section>
  );
};

const SendMsgForm = ({ handleSendMsg, senderID, receiverID }: any) => {
  const [msgBody, setMsgBody] = useState('');
  return (
    <form
      action=""
      className="relative w-full flex items-center justify-between"
      onSubmit={(e) => {
        handleSendMsg(e);
        setMsgBody('');
      }}
    >
      <label
        htmlFor="uploaded-image"
        className="rounded-full mr-2 cursor-pointer"
      >
        <i className="bx bx-image text-2xl p-2 rounded-full hover:bg-gray-200"></i>
      </label>
      {/* <input id="uploaded-image" type="file" className="hidden"></input>   */}
      <input
        name="msgBody"
        className="rounded-3xl flex-auto bg-gray-200 px-4 py-2 text-gray-500"
        placeholder="Aa"
        value={msgBody}
        onChange={(e) => setMsgBody(e.target.value)}
      ></input>
      <input name="user" type="hidden" value={senderID}></input>
      <input name="receiver" type="hidden" value={receiverID}></input>

      <button className="rounded-full ml-2 cursor-pointer" type="submit">
        <i className="bx bx-send text-2xl p-2 rounded-full hover:bg-gray-200"></i>
      </button>
      <button className="rounded-full ml-2 cursor-pointer">
        <i className="bx bxs-hand text-2xl p-2 rounded-full hover:bg-gray-200"></i>
      </button>
    </form>
  );
};

export type Users = {
  sender: {
    id: string;
    avatar: string;
    fullname: string;
    isOnline: boolean;
  };
  receiver: {
    id: string;
    avatar: string;
    fullname: string;
    isOnline: boolean;
  };
};

export type msgObject = {
  id: string;
  user: string;
  status: boolean;
  time: string;
  body: string;
};

export default ChatDetails;
