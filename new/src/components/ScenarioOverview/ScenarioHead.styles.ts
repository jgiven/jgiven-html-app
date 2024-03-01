import { styled } from "@mui/material/styles";
import { Box, Button, Drawer, Link } from "@mui/material";

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

export const StyledIconContainer = styled(Box)({
    width: "30px",
    height: "30px",
    p: 0.01,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid grey",
    borderRadius: 1,
    marginRight: "5px"
});

export const StyledIconButton = styled(Button)({
    "&:hover": { textDecoration: "none", color: "inherit" },
    "min-width": "1px",
    "min-height": "1px",
    height: "30px",
    color: "black"
});
