resource "aws_vpc" "ttt_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "ttt_vpc"
  }
}
