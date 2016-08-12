import * as transform from '../lib/transform'

export default const GenericAudioParam = ({
  median,
  perturbation,
  actual,
  address,
  label,
  action}) => {
  let divStyle = {
    width: transform.bipolPerc(actual || 0.0)+"%"
  };
  return (<div className={"param-control " + address} >
    <label className="label"
      htmlFor={address + "-slider"}>
      {label}
    </label>
    <div className="slider-wrap">
      <input className="slider value"
        id={address + "-slider"}
        type="range"
        value={median}
        onChange={(ev)=>action(ev.target.value)}
        min="-1" max="1" step="any" />
      <div className="state-bar"
        id={address + "-slider-actual"}
        style={divStyle} />
    </div>
  </div>)
};
