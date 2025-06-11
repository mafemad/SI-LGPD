import React from 'react';
import { Switch, Typography, Card } from 'antd';

interface Props {
  name: string;
  optedIn: boolean;
  onChange: (newValue: boolean) => void;
}

const PreferenceItem: React.FC<Props> = ({ name, optedIn, onChange }) => {
  return (
    <Card
      size="small"
      bodyStyle={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      hoverable
    >
      <Typography.Text>{name}</Typography.Text>
      <Switch checked={optedIn} onChange={onChange} />
    </Card>
  );
};

export default PreferenceItem;
