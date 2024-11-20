import { Typography } from "antd";

const { Text: AntText } = Typography;

export const Text = (props: any) => {
    return <AntText>{props.children}</AntText>;
}