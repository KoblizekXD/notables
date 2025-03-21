import logger from "@/lib/logging";

export default function Home() {
  logger.info("yes");

  return <h1 className="">Hello, world!</h1>;
}
