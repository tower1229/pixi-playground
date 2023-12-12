import { Step } from "../_utils";

export const GameOver = ({
  path,
  onExit,
}: {
  path: Step[];
  onExit: () => void;
}) => {
  const handleSettlement = (path: Step[]) => {
    console.log("settlement", path);
  };

  handleSettlement(path);

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center bg-[rgba(0,0,0,.3)] text-white p-4">
      <div className="mockup-code bg-base-100 text-base-content">
        <pre data-prefix="$">
          <code>Game completed!</code>
        </pre>
        <pre data-prefix=">" className="text-warning">
          <code>Settlement in progress...</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>1/3 Generate ZKP</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>2/3 ZK verification</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>3/3 Done!</code>
        </pre>
        <pre data-prefix=">" className="bg-warning text-warning-content">
          <code>Congratulations!</code>
        </pre>

        <div className="w-full px-4 mt-4 text-center">
          <button className="btn btn-sm rounded-none ">My ZKP</button>
          <button className="btn btn-sm rounded-none btn-success ">
            My Achievements
          </button>
          <button
            className="btn btn-sm rounded-none btn-error text-white"
            onClick={onExit}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};
