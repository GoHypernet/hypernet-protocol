import React from "react";
import styles from "./SucessContent.style";

interface ISucessContentProps {
  label?: string;
  info?: string;
  onOkay?: () => void;
}

const SucessContent: React.FC<ISucessContentProps> = (props: ISucessContentProps) => {
  const { label = "SUCCESS!", info, onOkay } = props;
  return (
    <div style={styles.container}>
      <img
        width="150"
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1614379253/images/Screen_Shot_2021-02-27_at_01.40.43.png"
      />
      <div style={styles.rightWrapper}>
        <div style={styles.textWrapper}>
          <div style={styles.label}>{label}</div>
          {info && <div style={styles.info}>{info}</div>}
        </div>
        {onOkay && (
          <div style={styles.buttonWrapper}>
            <button style={styles.button} onClick={onOkay}>
              OKAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SucessContent;
