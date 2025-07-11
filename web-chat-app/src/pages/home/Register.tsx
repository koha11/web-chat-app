import { Link, redirect, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IRegisterRequest } from "../../interfaces/auth/registerRequest.interface";
import { useRegister } from "../../hooks/auth.hook";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();

  const { handleSubmit, register, watch, control } =
    useForm<IRegisterRequest>();

  const [registerAccount] = useRegister();

  const handleRegister = (data: IRegisterRequest) => {
    registerAccount({
      variables: {
        ...data,
      },
      onCompleted({ register: response }, clientOptions) {
        if (response.isValid && response.data != undefined) {
          Cookies.set("accessToken", response.data.accessToken);
          Cookies.set("userId", response.data.userId);
          navigate("/m");
        }
      },
    });
  };

  return (
    <section className="flex justify-center items-center flex-col h-[100vh]">
      <image href="/favicon.ico"></image>
      <h2 className="py-4 text-3xl font-mono font-bold">WEB CHAT</h2>
      <form
        className="flex flex-col w-[40%] items-center mt-12"
        onSubmit={handleSubmit(handleRegister)}
      >
        <input
          {...register("fullname")}
          placeholder="Fullname"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          {...register("email")}
          placeholder="Email"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          {...register("username")}
          placeholder="Username"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          {...register("password")}
          placeholder="Password"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          {...register("rePassword")}
          placeholder="Retype Password"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-4xl mt-6"
        >
          Register
        </button>
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Link to="/login" className="cursor-pointer hover:opacity-70">
          Login
        </Link>
        <Link to="" className="cursor-pointer hover:opacity-70">
          Forgot password
        </Link>
      </div>
    </section>
  );
};

export default Register;
