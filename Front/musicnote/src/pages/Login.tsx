import Logo from "../assets/logo/logo.png";
import LogoName from "../assets/logo/long-logo.png";

export default function Login() {
  return (
    <div>
      <div className="flex flex-col max-w-[560px] items-center justify-center">
        <div className="p-12 bg-[#262329] rounded-full">
          <img className="max-w-full" src={Logo} alt="로고" />
        </div>
        <img className="max-w-full mt-12" src={LogoName} alt="로고이름" />
      </div>
    </div>
  );
}
