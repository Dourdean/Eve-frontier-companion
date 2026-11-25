import { AuxiliaryPanel } from "./AuxiliaryPanel";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { WalletMenu } from "./WalletMenu";

function App() {
  return (
    <Box style={{ padding: "20px" }}>
      <Flex
        px="4"
        py="2"
        direction="row"
        align="center"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Heading>AUXILIARY</Heading>
        <WalletMenu />
      </Flex>

      <p style={{ color: "#63DCD6", fontSize: "18px" }}>
        Awaiting your instructions, Sigzil.
      </p>

      <WalletStatus />
      <AuxiliaryPanel />
    </Box>
  );
}

export default App;
