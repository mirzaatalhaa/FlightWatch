resource "aws_internet_gateway" "flightwatch_igw" {
  vpc_id = aws_vpc.flightwatch_vpc.id

  tags = {
    Name = "flightwatch-igw"
  }
}