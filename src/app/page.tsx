import logger from "@/lib/logging";

export default function Home() {
  logger.info("Hello, world!");

  return <h1 className="">Hello, world!</h1>;
}
