type HeaderPrams = {
    text : String;   
    name? : String;  //* the diffrence between "text" and "name?" width "?" it's to make "name" not obligatoir or optionel. 
}
  
function Header({text, name} : HeaderPrams) {

    let hideName = true; //* or false ==> the name will hide

    return (
        <>
            <h1 className="font-bold" style={{color: "red", backgroundColor: "pink", padding: "10px"}}>
                {text}
            </h1> {/*we use inline style like html with style={{property:"var"}} */}
            {hideName ? <span>{name}</span> : null} {/*test for the name is true or false.*/}
            {hideName && <span>{name}</span>} {/*Other way to test the existing name, it's recommanded.*/}
        </>
    );

}

export default Header;