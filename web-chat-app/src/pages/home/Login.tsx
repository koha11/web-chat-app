import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../services/api';
import Cookies from 'js-cookie';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn chặn reload trang

    try {
      const formData = new FormData(event.currentTarget);

      const response = await postData('/signin', formData);
      if (response.status == 1) {
      }

      if (response.status == 2) {
        Cookies.set('accessToken', response.access_token, {
          expires: parseInt(response.expiresIn) / 24,
        });
        navigate('/m');
        // window.location.href = 'http://' + window.location.host + '/m';
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex justify-center items-center flex-col h-[100vh]">
      <image href="/favicon.ico"></image>
      <h2 className="py-4 text-3xl font-mono font-bold">WEB CHAT</h2>
      <form
        className="flex flex-col w-[40%] items-center mt-12"
        onSubmit={handleLogin}
      >
        <input
          name="username"
          placeholder="Tên đăng nhập"
          className="py-2 px-3 border rounded border-gray-400 w-full"
        ></input>
        <input
          name="password"
          placeholder="Mật khẩu"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-4xl mt-6"
        >
          Tiếp tục
        </button>
        <div className="mt-6">
          <input id="rbmBtn" type="checkbox" name="rmbBtn"></input>
          <label htmlFor="rbmBtn" className="ml-2">
            Duy trì đăng nhập
          </label>
        </div>
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Link to="/register" className="cursor-pointer hover:opacity-70">
          Đăng ký
        </Link>
        <Link to="/register" className="cursor-pointer hover:opacity-70">
          Quên mật khẩu
        </Link>
      </div>
    </section>
  );
}

export default Login;
