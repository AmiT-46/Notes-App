// import { FaRegEye, FaRegEyeSlash } from "react-icons"

function PasswordInput({ value, onChange, placeholder }){

    return (
        <div className="password-input">
            <input
            value={value}
            onChange={onChange}
            type="password"
            placeholder={placeholder || "Password"}
            className="password-input__field"
            />
        </div>
    )
}

export default PasswordInput
