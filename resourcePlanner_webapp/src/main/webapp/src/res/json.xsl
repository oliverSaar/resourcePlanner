<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- Init -->
<xsl:template match="/">
  <xsl:text>{</xsl:text>
  <xsl:call-template name="iterate"/>
  <xsl:text>}</xsl:text>
</xsl:template>

<!-- Iterate -->
<xsl:template name="iterate">
  <xsl:for-each select="./*">
    <xsl:call-template name="type"/>
    <xsl:call-template name="seperation"/>
  </xsl:for-each>
</xsl:template>

<!-- Seperation -->
<xsl:template name="seperation">
  <xsl:if test="following-sibling::*[1]">
    <xsl:text>,</xsl:text>
  </xsl:if>
</xsl:template>

<!-- Attribute -->
<xsl:template name="attribute">
  <xsl:text>"</xsl:text>
    <xsl:value-of select="name(.)"/>
  <xsl:text>":</xsl:text>
</xsl:template>

<!-- Value -->
<xsl:template name="value">
  <xsl:text>"</xsl:text>
    <xsl:value-of select="."></xsl:value-of>
  <xsl:text>"</xsl:text>
</xsl:template>

<!-- Type -->
<xsl:template name="type">
  <xsl:if test="not(../@type='array')">
    <xsl:call-template name="attribute"/>
  </xsl:if>
  <xsl:choose>
    <xsl:when test="@type='array'">
      <xsl:call-template name="array"/>
    </xsl:when>
    <xsl:when test="@type='object'">
      <xsl:call-template name="object"/>
    </xsl:when>
    <xsl:when test="@type='number'">
      <xsl:call-template name="number"/>
    </xsl:when>
    <xsl:otherwise>
      <xsl:call-template name="value"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<!-- Array -->
<xsl:template name="array">
  <xsl:text>[</xsl:text>
    <xsl:call-template name="iterate"/>
  <xsl:text>]</xsl:text>
</xsl:template>

<!-- Object -->
<xsl:template name="object">
  <xsl:text>{</xsl:text>
    <xsl:call-template name="iterate"/>
  <xsl:text>}</xsl:text>
</xsl:template>

<!-- Number -->
<xsl:template name="number">
  <xsl:value-of select="."></xsl:value-of>
</xsl:template>

</xsl:stylesheet>

