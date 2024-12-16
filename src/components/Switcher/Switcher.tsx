import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import cn from "classnames";

interface SwitcherProps {
  isOn: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switcher: React.FC<SwitcherProps> = ({ isOn, onChange, disabled = false }) => {
  const [togglePosition, setTogglePosition] = useState(isOn ? styles.toggleOn : styles.toggleOff);

  const toggleSwitch = useCallback(() => {
    if(disabled) return
    setTogglePosition(current => current === styles.toggleOn ? styles.toggleOff : styles.toggleOn)
    onChange(!isOn);
  }, [isOn, onChange, disabled]);

  return (
    <div className={styles.switchBlock}>
      <span>Ориентированный граф?</span>
      <div
        className={cn(styles.iosSwitch, disabled ? styles.disabled : "", { [styles.active]: isOn })}
        onClick={toggleSwitch}
      >
        <div className={cn(styles.slider, togglePosition)}>
        </div>
      </div>
    </div>
  );
};
