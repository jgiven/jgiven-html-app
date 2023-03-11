import CheckIcon from "@mui/icons-material/CheckBox";
import {SvgIconTypeMap, SxProps, Theme} from "@mui/material";

export type FontSizes = SvgIconTypeMap["props"]["fontSize"]
export function GreenCheckbox(props:{sx?:SxProps<Theme>, fontSize?: FontSizes}){
    return (<CheckIcon sx={{...props.sx, color:'green'}} fontSize={props.fontSize}></CheckIcon>)
}