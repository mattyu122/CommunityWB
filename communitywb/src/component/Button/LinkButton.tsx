import { Button } from 'antd';

import { ButtonProps } from 'antd';

const LinkButton = (props: ButtonProps) => {
    return <Button type="link" {...props} />;
};

export default LinkButton;