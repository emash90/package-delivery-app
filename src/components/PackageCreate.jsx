import { useState } from "react";

import {
    Grid,
    TextField,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Select,
    MenuItem,
    Button,
} from "@mui/material";

const PackageCreate = () => {
    return (
        <>
        <h4>Create Package</h4>
        <form>
            <Grid container mt={3} direction="column">
                <Grid item mb={3}>
                    <TextField
                        fullWidth
                        id="packageDescription"
                        label="package description"
                        type="text"
                    />
                </Grid>
                <Grid item mb={3} lg>
                    <TextField
                        id="packageFromName"
                        label="sender's name"
                        type="text"
                        style={{ width: "45%", marginRight: '22px' }}
                    />
                    <TextField
                        id="packageToName"
                        label="receiver's name"
                        type="text"
                        style={{ width: "45%" }}
                    />
                </Grid>
                <Grid item mb={3} lg>
                    <TextField
                        id="packageFromName"
                        label="sender's address"
                        type="text"
                        style={{ width: "45%", marginRight: '22px' }}
                    />
                    <TextField
                        id="packageToName"
                        label="receiver's address"
                        type="text"
                        style={{ width: "45%" }}
                    />
                </Grid>

                <Grid item mb={3}>
                    <TextField
                        id="height"
                        label="height (cm)"
                        type="number"
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        id="width"
                        label="width (cm)"
                        type="number"
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        id="weight"
                        label="weight (g)"
                        type="number"
                        style={{ marginRight: "15px" }}
                    />
                    <TextField id="depth" label="depth (cm)" type="number" />
                </Grid>
                <Grid item>
                    <TextField
                        id="senderLocationLatitude"
                        label="sender's location latitude"
                        type="number"
                    />
                    <TextField
                        id="senderLocationLongitude"
                        label="sender's location longitude"
                        type="number"
                        style={{ marginRight: "3.5rem" }}
                    />
                    <TextField
                        id="receiverLocationLatitude"
                        label="receiver location latitude"
                        type="number"
                    />
                    <TextField
                        id="receiverLocationLongitude"
                        label="receiver location longitude"
                        type="number"
                    />
                </Grid>
            </Grid>
            <div style={{marginTop: '1rem'}}>
                <Button style={{width: '40%', marginRight: '10rem'}} variant="contained" color="primary" type="submit">
                    Submit
                </Button>
                <Button style={{width: '40%'}} variant="contained" color="secondary" type="submit">
                    Go back
                </Button>
            </div>
        </form>
        </>
    );
};
export default PackageCreate;
