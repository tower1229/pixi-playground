import { ButtonEnable } from "@/components";

export const Hero = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/nauris-amatnieks-forestbattlebackground.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">ZK Maze</h1>
          <p className="mb-5">
            In this game, we will show you the concept of zero knowledge proof
            through a maze excaping game. please connect your wallet to play
          </p>
          <ButtonEnable />
        </div>
      </div>
    </div>
  );
};
