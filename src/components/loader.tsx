export default function Loader(props:any){
    return <div className={[`loader`, (props.className || '')].join(' ')}>
        <span className="lds-dual-ring"></span>
    </div>
}