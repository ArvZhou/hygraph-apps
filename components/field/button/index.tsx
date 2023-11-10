import styles from './styles.module.css';

type ButtonProps = {
    children: JSX.Element | JSX.Element[] | string,
    onClick: () => void | Promise<void>
}

const Button = ({children, onClick=() => void 0} : ButtonProps) => {
    return (
        <div className={styles.buttonwrapper} onClick={onClick}>
            <div className={styles.button}>
                {children}
            </div>
        </div>
    )
}

export default Button;