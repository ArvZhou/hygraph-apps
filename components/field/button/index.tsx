import styles from './styles.module.css';

type ButtonProps = {
    children: JSX.Element | JSX.Element[] | string,
    onClick: () => void | Promise<void>,
    icon: JSX.Element
}

const Button = ({children, onClick, icon} : ButtonProps) => {
    return (
        <div className={styles.buttonwrapper} onClick={onClick}>
            <div className={styles.button}>
                {icon}
                {children}
            </div>
        </div>
    )
}

export default Button;