import { styled } from "@mui/material/styles";
import { Drawer, Link } from "@mui/material";

export const StyledDrawer = styled(Drawer)({
    // width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        backgroundColor: "rgba(250,250,250,255)"
    }
});

export const StyledContent = styled("div")(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3)
}));

export const StyledLink = styled(Link)({
    cursor: "pointer"
});
