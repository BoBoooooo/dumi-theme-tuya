import './Device.less';

import { context, usePrefersColor } from 'dumi/theme';
import QRCode from 'qrcode.react';
import React, { FC, useContext, useEffect, useState } from 'react';

import { appendParams } from '../utils';

interface IDeviceProps {
  className?: string;
  url: string;
  title?: string;
  forwardRef?: React.MutableRefObject<HTMLIFrameElement>;
}

const Device: FC<IDeviceProps> = ({
  url,
  className = '',
  title = 'tuya',
  forwardRef,
}) => {
  const [renderKey, setRenderKey] = useState(Math.random());
  const [dateTime, setDateTime] = useState(new Date());
  const [color] = usePrefersColor();
  const {
    config: { mode, theme },
    meta,
  } = useContext(context);

  const qrcode = theme?.qrcode;
  const demo = meta?.demo;

  // re-render iframe if prefers color changed
  useEffect(() => {
    setRenderKey(Math.random());
  }, [color]);
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className={['__dumi-default-device'].concat(className).join(' ')}
      data-device-type="iOS"
      data-mode={mode}
    >
      <div className="device_contain">
        <div className="__dumi-default-device-status">
          <span>{title}</span>
          <span>{`${dateTime
            .getHours()
            .toString()
            .padStart(2, '0')}:${dateTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`}</span>
        </div>
        <iframe
          ref={forwardRef}
          title="dumi-previewer"
          src={url}
          key={renderKey}
        />
        <div className="__dumi-default-device-action">
          <button
            className="__dumi-default-icon"
            role="refresh"
            onClick={() => setRenderKey(Math.random())}
          />
          <button className="__dumi-default-icon" role="qrcode">
            <QRCode
              value={qrcode ? appendParams(qrcode, { demo }) : url}
              size={96}
            />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="__dumi-default-icon"
            role="open-demo"
          />
        </div>
      </div>
    </div>
  );
};

export default Device;