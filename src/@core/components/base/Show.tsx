export default function Show(props : any) {
    if(props.when) {
      return (
        <>{props.children}</>
      )
    }
    return (null);
  }
  