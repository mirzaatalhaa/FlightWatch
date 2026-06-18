resource "aws_subnet" "flightwatch_private_subnet_1" {
  vpc_id            = aws_vpc.flightwatch_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "flightwatch-private-subnet-1"
  }
}

resource "aws_subnet" "flightwatch_private_subnet_2" {
  vpc_id            = aws_vpc.flightwatch_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "flightwatch-private-subnet-2"
  }
}