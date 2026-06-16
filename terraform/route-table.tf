resource "aws_route_table" "flightwatch_public_route_table" {
  vpc_id = aws_vpc.flightwatch_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.flightwatch_igw.id
  }

  tags = {
    Name = "flightwatch-public-route-table"
  }
}

resource "aws_route_table_association" "flightwatch_public_route_table_association" {
  subnet_id      = aws_subnet.flightwatch_public_subnet.id
  route_table_id = aws_route_table.flightwatch_public_route_table.id
}